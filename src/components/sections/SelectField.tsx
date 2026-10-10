"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Custom dropdown replacing the native <select> (whose popup is OS-rendered
 * and cannot be styled). Underline field that opens an ivory paper menu with
 * staggered options, keyboard navigation and click-outside handling.
 */
export default function SelectField({
  name,
  value,
  placeholder,
  options,
  onChange,
}: {
  name: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const root = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open ]);

  const setOpenFresh = (v: boolean) => {
    if (v) setHighlight(-1);
    setOpen(v);
  };

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpenFresh(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      choose(options[highlight]);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : setOpenFresh(true))}
        onKeyDown={onKey}
        className={`flex w-full items-center justify-between gap-3 border-b bg-transparent py-3 text-left text-base outline-none transition-colors duration-300 ${
          open
            ? "border-copper"
            : "border-bone/35 hover:border-bone/60"
        } ${value ? "text-bone" : "text-[#8A7D68]"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rotate-45 border-b-2 border-r-2 transition-all duration-400 ${
            open ? "-translate-y-0.5 -rotate-[135deg] border-copper" : "translate-y-0 border-bone/50"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={placeholder}
            initial={{ opacity: 0, y: -8, scaleY: 0.98 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full z-50 mt-2 max-h-64 origin-top overflow-y-auto border border-bone/20 bg-white py-2 shadow-[0_30px_60px_-20px_rgba(33,27,18,0.35)]"
          >
            {options.map((o, i) => {
              const selected = o === value;
              const lit = i === highlight;
              return (
                <motion.li
                  key={o}
                  role="option"
                  aria-selected={selected}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.03 * i }}
                >
                  <button
                    type="button"
                    role="presentation"
                    onClick={() => choose(o)}
                    onMouseEnter={() => setHighlight(i)}
                    className={`flex w-full items-center justify-between gap-3 border-l-2 px-4 py-3 text-left text-[0.95rem] transition-colors duration-200 ${
                      selected
                        ? "border-copper bg-copper/10 font-semibold text-bone"
                        : lit
                          ? "border-transparent bg-copper/[0.07] text-bone"
                          : "border-transparent text-bone/80 hover:bg-copper/[0.07]"
                    }`}
                  >
                    <span className="truncate">{o}</span>
                    {selected ? (
                      <span aria-hidden="true" className="font-bold text-copper">
                        ✓
                      </span>
                    ) : null}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
