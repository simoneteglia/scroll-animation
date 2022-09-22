import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.Suspense fallback={null}>
		<div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
			<App />
		</div>
	</React.Suspense>
);
