import { HelpCircle, icons } from "lucide-react";

const DynamicIcon = ({ name }: { name: string }) => {
  const LucideIcon = (icons[name as keyof typeof icons] ?? HelpCircle) as
    | typeof HelpCircle
    | undefined;

  if (!LucideIcon) {
    return <HelpCircle className="h-5 w-5" />;
  }

  return <LucideIcon className="h-5 w-5" />;
};

export default DynamicIcon;
