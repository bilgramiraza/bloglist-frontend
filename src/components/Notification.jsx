import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";
import { STATUS } from "../utils/constants";

function Notification() {
  return (
    <Toaster
      richColors={true}
      visibleToasts={9}
      position="top-right"
      expand={true}
    />
  );
}

export const notifySuccess = msg => toast.success(msg, { duration: 3000 });

export const notifyError = msg => toast.error(msg, { duration: 5000 });

const serializeQueryKey = (key) => typeof key === 'string' ? key : JSON.stringify(key);

export const useQueryWithToast = ({
  queryKey,
  queryFn,
  queryOptions = {},
  toastMsg = {
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error',
  }
}) => {
  const query = useQuery({
    queryKey,
    queryFn,
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
    ...queryOptions,
  });

  const prevError = useRef(false);
  const didToast = useRef(false);

  useEffect(() => {
    if (query.isLoading) {
      toast.loading(toastMsg.loading, {
        id: serializeQueryKey(queryKey),
        duration: Infinity,
      });
      didToast.current = false;
    }
    if (query.isError && query.error?.message !== prevError.current) {
      toast.error(typeof toastMsg.error === 'function'
        ? toastMsg.error(query.error)
        : query.error?.message || toastMsg.error,
        {
          id: serializeQueryKey(queryKey),
          duration: 5000,
        });
      prevError.current = query.error?.message;
      didToast.current = true;
    }
    if (query.isSuccess && !didToast.current) {
      toast.success(typeof toastMsg.success === 'function'
        ? toastMsg.success(query.data)
        : toastMsg.success,
        {
          id: serializeQueryKey(queryKey),
          duration: 3000
        });
      didToast.current = true;
    }
  }, [query.isLoading, query.isSuccess, query.isError, query.error]);

  useEffect(() => {
    return () => toast.dismiss(serializeQueryKey(queryKey));
  }, []);

  return query;
};

export const useMutationWithToast = ({
  mutationFn,
  mutationOptions = {},
  toastMsg = {
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error',
  },
}) => {
  return useMutation({
    mutationFn: async (mutationData) => {
      const mutationPromise = mutationFn(mutationData);
      toast.promise(
        mutationPromise,
        {
          loading: toastMsg.loading,
          success: (data) => typeof toastMsg.success === 'function'
            ? toastMsg.success(data)
            : toastMsg.success,
          error: (data) => typeof toastMsg.error === 'function'
            ? toastMsg.error(data)
            : error?.message || toastMsg.error,
        }
      );
      return await mutationPromise;
    },
    ...mutationOptions,
  });
}

export const useToast = ({
  status,
  toastMsg = {
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error',
  },
  toastOptions = {
    id: 'auth',
  },
  resetFn = null,
}) => {
  const prevError = useRef(false);
  const didToast = useRef(false);

  const resetFnTimeoutRef = useRef(null);

  useEffect(() => {
    if (resetFnTimeoutRef.current) {
      clearTimeout(resetFnTimeoutRef.current);
    }

    if (status === STATUS.LOADING) {
      toast.loading(toastMsg.loading, {
        id: toastOptions.id,
        duration: Infinity,
      });
      didToast.current = false;
    }
    if (status === STATUS.FAILED && toastMsg.error !== prevError.current) {
      toast.error(
        toastMsg.error,
        {
          id: toastOptions.id,
          duration: 5000,
        });
      prevError.current = toastMsg.error;
      didToast.current = true;

      if (resetFn) {
        resetFnTimeoutRef.current = setTimeout(() => resetFn(), 5000 + 100);
      }
    }
    if (status === STATUS.SUCCEEDED && !didToast.current) {
      toast.success(
        toastMsg.success,
        {
          id: toastOptions.id,
          duration: 3000,
        });
      didToast.current = true;

      if (resetFn) {
        resetFnTimeoutRef.current = setTimeout(() => resetFn(), 3000 + 100);
      }
    }
    return () => {
      if (resetFnTimeoutRef.current) {
        clearTimeout(resetFnTimeoutRef.current);
      }
    }
  }, [status]);

  useEffect(() => {
    return () => toast.dismiss(toastOptions.id);
  }, []);
};

export default Notification;
