import { body, validationResult, check, param, query } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

export { body, validationResult } from "express-validator";

export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  console.log(errorMessages);

  if (errors.isEmpty()) return next();
  else return ErrorHandler(res, errorMessages, 400);
};

export const registerValidator = () => [
  body("name", "Please enter Name").notEmpty(),
  body("username", "Please enter Username").notEmpty(),
  body("bio", "Please enter Bio").notEmpty(),
  body("password", "Please enter Password").notEmpty(),
];

export const loginValidator = () => [
  body("username", "Please enter Username").notEmpty(),
  body("password", "Please enter Password").notEmpty(),
];

export const newGroupValidator = () => [
  body("name", "Please enter Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please add Members")
    .isArray({ min: 2, max: 150 })
    .withMessage("Members must be in 2-150"),
];

export const addMembersValidator = () => [
  body("chatId", "Please enter ChatID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please add Members")
    .isArray({ min: 1, max: 147 })
    .withMessage("Members must be in 1-147"),
];

export const removeMembersValidator = () => [
  body("chatId", "Please enter ChatID").notEmpty(),
  body("userId", "Please enter UserID").notEmpty(),
];

export const sendAttachmentsValidator = () => [
  body("chatId", "Please enter ChatID").notEmpty(),
];

export const getMessagesValidator = () => [
  param("id", "Please enter ChatID").notEmpty(),
];

export const chatIdValidator = () => [
  param("id", "Please enter ChatID").notEmpty(),
];

export const renameValidator = () => [
  param("id", "Please enter ChatID").notEmpty(),
  body("name", "Please enter New Name").notEmpty(),
];

export const sendRequestValidator = () => [
  body("userId", "Please enter User ID").notEmpty(),
];

export const acceptRequestValidator = () => [
  body("requestId", "Please enter Request ID").notEmpty(),
  body("accept", "Please Add Accept")
    .notEmpty()
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];

export const adminLoginValidator = () => [
  body("secretKey", "Please enter secret Key").notEmpty(),
];

export const getAllNotificationsValidator = () => [
  body("requestId", "Please enter Request ID").notEmpty(),
  body("accpet", "Please Add Accept")
    .notEmpty()
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];
