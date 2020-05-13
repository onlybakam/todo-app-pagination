"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTodo = exports.updateTodo = exports.createTodo = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
var createTodo =
/* GraphQL */
"\n  mutation CreateTodo(\n    $input: CreateTodoInput!\n    $condition: ModelTodoConditionInput\n  ) {\n    createTodo(input: $input, condition: $condition) {\n      id\n      name\n      description\n      owner\n      dueOn\n    }\n  }\n";
exports.createTodo = createTodo;
var updateTodo =
/* GraphQL */
"\n  mutation UpdateTodo(\n    $input: UpdateTodoInput!\n    $condition: ModelTodoConditionInput\n  ) {\n    updateTodo(input: $input, condition: $condition) {\n      id\n      name\n      description\n      owner\n      dueOn\n    }\n  }\n";
exports.updateTodo = updateTodo;
var deleteTodo =
/* GraphQL */
"\n  mutation DeleteTodo(\n    $input: DeleteTodoInput!\n    $condition: ModelTodoConditionInput\n  ) {\n    deleteTodo(input: $input, condition: $condition) {\n      id\n      name\n      description\n      owner\n      dueOn\n    }\n  }\n";
exports.deleteTodo = deleteTodo;