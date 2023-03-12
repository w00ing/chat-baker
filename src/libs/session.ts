import type { SessionStore } from "next-session";
import type { SessionData, SessionRecord } from "next-session/lib/types";

class CustomStore implements SessionStore {
  get(sid: string): Promise<SessionData<SessionRecord> | null | undefined> {
    throw new Error("Method not implemented.");
  }
  set(sid: string, sess: SessionData<SessionRecord>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  destroy(sid: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  touch?(sid: string, sess: SessionData<SessionRecord>): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
