import { interpret } from "xstate";
import { appMachine } from ".";

const appService = interpret(appMachine, { devTools: true }).start();

export default appService;
