interface Err<T> {
  success: false;
  error: T;
}

interface Ok<T> {
  success: true;
  value: T;
}

export const Err = <T>(error: T): Err<T> => ({
  success: false,
  error,
});

export const Ok = <T>(value: T): Ok<T> => ({
  success: true,
  value,
});
