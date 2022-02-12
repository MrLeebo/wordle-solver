import React, { memo } from "react";
import { Form as RemixForm, FormProps } from "remix";

function Form(props: FormProps) {
  return (
    <RemixForm
      className="rounded-xl bg-gradient-to-r bg-white border border-gray-200 p-2 sm:p-6"
      {...props}
    />
  );
}

export default memo(Form);
