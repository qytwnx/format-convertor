type OptionsModel<T> = {
  label?: string;
  value?: T;
};

type ProgressModel<T> = {
  file: T;
  progressStatus: ProgressStatusEnum;
  data: number | string | boolean;
  message: string;
};
