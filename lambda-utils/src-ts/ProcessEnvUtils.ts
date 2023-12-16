export default class ProcessEnvUtils {

  public static getVar(variableName: string): string {
    const variable = process.env[variableName];
    if (!variable) throw new Error(`process.env.${variableName} not found.`);
    return variable;
  }
}
