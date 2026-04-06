import { Router } from "express";
import { authRequired } from "../../middlewares/auth.js";
import { validateBody } from "../../middlewares/validate.js";
import { createResourceInviteSchema, createResourceSchema, submitResourceSchema } from "@Yovid/shared";
import * as C from "./resources.controller.js";
import * as ContentC from "./content-request.controller.js";
const r = Router();
// Content request endpoints
r.post("/request-contributor", ContentC.requestContributor);
r.post("/verify-contributor", ContentC.verifyContributor);
r.get("/check-contributor", ContentC.checkContributorStatus);
// Resource endpoints
r.get("/", C.list);
r.post("/invite", authRequired, validateBody(createResourceInviteSchema), C.invite);
r.post("/submit", validateBody(submitResourceSchema), C.submit);
r.post("/", authRequired, validateBody(createResourceSchema), C.create);
r.post("/:id/approve", authRequired, C.approve);
export default r;
