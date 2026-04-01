export type CompilerLanguage = {
  id: number;
  name: string;
};

export type CompilerResult = {
  status: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  message: string;
  time: string;
  memory: number;
};

export type CompilerPreset = {
  match: RegExp;
  code: string;
  monacoLanguage: string;
};
