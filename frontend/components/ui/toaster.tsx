'use client'

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-1">
                  {title && <ToastTitle className="text-lg font-semibold mb-1">{title}</ToastTitle>}
                  {description && (
                    <ToastDescription className="text-sm text-gray-500 dark:text-gray-400">{description}</ToastDescription>
                  )}
                </div>
                <ToastClose className="ml-4 -mt-1">
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </ToastClose>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`toast-${id}`)?.remove()}
                >
                  OK
                </Button>
              </div>
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport className="fixed inset-0 flex items-center justify-center pointer-events-none" />
    </ToastProvider>
  )
}