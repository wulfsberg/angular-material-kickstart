package dk.wolfsbane.angularmaterialkickstart;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@WebServlet(urlPatterns = {"/index.html"})
public class IndexServlet extends HttpServlet {
  private byte[] bytes;
  private int status;
  private String csp;
  private String cspReportOnly;

  @Override
  public void init() throws ServletException {
    // Pick up the static index.html while defensively creating error messages for all sorts of situations:
    this.status = 500;
    try {
      ServletContext context = getServletContext();
      if (context == null) {
        this.bytes = "ServletContext is null".getBytes(StandardCharsets.UTF_8);
      } else {
        try (var in = context.getResourceAsStream("/index.html")) {
          if (in == null) {
            this.bytes = "No index.html deployed as static file in application".getBytes(StandardCharsets.UTF_8);
          } else {
            try (var bufferedIn = new BufferedInputStream(in)) {
              this.bytes = bufferedIn.readAllBytes();
              this.status = 200;
            }
          }
        } catch (Exception e) {
          this.bytes = ("Could not read index.html: " + e).getBytes(StandardCharsets.UTF_8);
        }
      }
    } catch (Exception e) {
      this.bytes = ("Could not get ServletContext: " + e).getBytes(StandardCharsets.UTF_8);
    }
    // Pick up CSP parameters given to the servlet as init parameters (from the web.xml):
    this.getInitParameterNames().asIterator().forEachRemaining(param -> {
      if ("Content-Security-Policy".equalsIgnoreCase(param)) {
        this.csp = blankToNull(this.getInitParameter(param));
      } else if ("Content-Security-Policy-Report-Only".equalsIgnoreCase(param)) {
        this.cspReportOnly = blankToNull(this.getInitParameter(param));
      }
    });
  }

  private static String blankToNull(String s) {
    if (s == null) {
      return null;
    }
    return s.isBlank() ? null : s.strip();
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    // If we hit this through the 404 error handler, we could potentially use the URI which triggered the error to
    // decide whether to show the index.html or an actual 404 error page. (Say, pattern matching against known routes or
    // route format). Though be aware that since we're already in an error handler, we cannot simply redirect to the
    // default error page, but have to write our own.
    // Object errorCode = req.getAttribute(ERROR_STATUS_CODE);
    // Object errorUri = req.getAttribute(ERROR_REQUEST_URI);

    res.setContentType("text/html");
    res.setCharacterEncoding("utf-8");
    if (this.csp != null) {
      res.setHeader("Content-Security-Policy", this.csp);
    }
    if (this.cspReportOnly != null) {
      res.setHeader("Content-Security-Policy-Report-Only", this.cspReportOnly);
    }
    try (var out = res.getOutputStream()) {
      res.setStatus(this.status);
      res.setContentLength(this.bytes.length);
      out.write(this.bytes);
    }
  }
}
