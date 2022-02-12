import { createCookieSessionStorage } from "remix";

const {
  getSession,
  commitSession,
  destroySession
} = createCookieSessionStorage({
  cookie: {
    name: "__session"
  }
});

export { getSession, commitSession, destroySession };
