"use client";

const Dropdown: React.FC<{
  children: React.ReactNode;
  trigger: "hover" | "click";
  contentClassName?: string;
  dropdownClassname?: string;
  option?: string;
  options: React.ReactNode[];
  open: boolean;
  propagationStop?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  children,
  trigger,
  options,
  contentClassName = "",
  dropdownClassname = "",
  open,
  propagationStop,
  setOpen,
}) => {
  return (
    <div
      className={`relative ${contentClassName}`}
      onMouseEnter={() => trigger === "hover" && setOpen(true)}
      onMouseLeave={() => trigger === "hover" && setOpen(false)}
      onClick={(e) => {
        setOpen(!open);
        propagationStop && e.stopPropagation();
      }}
    >
      {children}

      <div
        className={`${
          open ? "h-fit max-h-screen" : "max-h-0"
        } bg-secondary-500 absolute right-0 z-30 overflow-hidden duration-700 ease-linear transition-all ${dropdownClassname}`}
      >
        {options?.map((option) => option)}
      </div>
    </div>
  );
};

export default Dropdown;
