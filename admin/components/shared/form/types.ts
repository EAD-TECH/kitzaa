export interface ReusableFormInputProps {
  control: any;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export interface ReusableFormSelectProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  options: {
    value: string;
    label: string;
  }[];
}
