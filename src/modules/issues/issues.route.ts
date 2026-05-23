import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import { UserRoles } from "../../types";

const route = Router()

route.post('/',auth(UserRoles.MAINTAINER,UserRoles.CONTRIBUTOR), issueController.createIssue)
route.get('/', issueController.getAllIssues)
route.get('/:id', issueController.GetIssueById)

export const issueRoute = route