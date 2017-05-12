<%-- We always deliver the page with status code 200, overriding the 404 which led us here,
     and simply deliver the normal index.html from the Angular application. --%>
<% response.setStatus(200); %><%@ include file="/index.html" %>
