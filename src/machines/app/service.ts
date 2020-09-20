import { interpret } from "xstate";
import appMachine from "./machine";

const appService = interpret(appMachine).start();

export default appService;
