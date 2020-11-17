import React, { Component, Suspense } from "react";
import { renderRoutes } from "react-router-config";
import { HashRouter as Router } from "react-router-dom";
import routes from "@/common/router.js";

class Root extends Component {
  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          {/* kick it all off with the root route */}
          {renderRoutes(routes)}
        </Router>
      </Suspense>
    );
  }
}
export default Root;
