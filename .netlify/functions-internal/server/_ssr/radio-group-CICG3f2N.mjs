import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Root2, a as Item2, I as Indicator } from "../_libs/radix-ui__react-radio-group.mjs";
import { c as cn } from "./utils-BB9uwBYF.mjs";
import { i as Circle } from "../_libs/lucide-react.mjs";
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = Root2.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = Item2.displayName;
export {
  RadioGroup as R,
  RadioGroupItem as a
};
