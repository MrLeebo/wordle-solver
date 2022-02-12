import { Meta, Links, Scripts, LiveReload, Outlet, useCatch } from "remix";

import stylesUrl from "./styles/app.css";
import Layout from "./components/Layout";

export function links() {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

function Document({ children, title }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-teal-50 h-full">
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <Document title={`${caught.status} ${caught.statusText}`}>
          <Layout>
            <h1>
              {caught.status} {caught.statusText}
            </h1>
          </Layout>
        </Document>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

export function ErrorBoundary({ error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <Layout>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
        <p>
          Replace this UI with what you want users to see when your app throws
          uncaught errors.
        </p>
      </Layout>
    </Document>
  );
}
