import { interpret } from "xstate";
import appMachine from "./machine";

const appService = interpret(appMachine, { devTools: true }).start();

export default appService;
