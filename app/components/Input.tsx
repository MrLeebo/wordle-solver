import React, { memo, forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  helpText?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, helpText, name, ...rest } = props;
  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        ref={ref}
        name={name}
        className="bg-gray-50 border border-gray-300 invalid:border-red-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-75"
        autoComplete="off"
        {...rest}
      />
      {helpText && <div className="mt-2 text-sm text-gray-500">{helpText}</div>}
    </div>
  );
});

export default memo(Input);
