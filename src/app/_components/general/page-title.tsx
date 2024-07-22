import { cn } from "~/lib/utils";




export const PageTitle = ({title,className}:{title:string,className?:string}) => {
  return (
    <h1 className={cn('text-xl font-bold text-purple-800 md:text-3xl',className)}>
      {title}{" "}
    </h1>
  );
};
