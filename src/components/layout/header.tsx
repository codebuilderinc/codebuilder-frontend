import Link from "next/link";

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-30 flex w-full items-center justify-between px-8 py-6 lg:px-16 lg:py-8">
      <Link
        href="/"
        className="text-foreground transition-opacity duration-300 hover:opacity-75"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="70"
          height="46"
          viewBox="0 0 70 46"
          className="h-[2.3rem] w-[3.5rem]"
          fill="none"
        >
          <path
            fill="#171717"
            fillRule="evenodd"
            d="M22.897 45.607c12.524 0 22.677-10.153 22.677-22.678C45.574 10.405 35.421.252 22.897.252S.219 10.405.219 22.929c0 12.525 10.154 22.678 22.678 22.678Zm2.772-19.25-5.58 7.113h4.96l8.242-10.577-8.206-10.504h-5.033l5.617 7.221c.243.316.523.596.839.84.316.242.608.4.875.473h-14.88v4.012h15.026c-.268.073-.584.244-.948.511-.34.243-.645.547-.912.912Z"
            clipRule="evenodd"
          />
          <path
            fill="tomato"
            fillRule="evenodd"
            d="M37.533 43.495c6.419-4.577 10.604-12.082 10.604-20.566 0-8.483-4.185-15.989-10.604-20.565a22.592 22.592 0 0 1 9.57-2.112c12.524 0 22.678 10.153 22.678 22.677 0 12.525-10.154 22.678-22.678 22.678-3.42 0-6.662-.757-9.57-2.112Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">next-transition-router</span>
      </Link>

      <Link
        href="https://github.com/ismamz/next-transition-router"
        target="_blank"
        className="flex items-center gap-3 text-lg font-medium uppercase text-foreground no-underline transition-opacity duration-300 hover:opacity-75 lg:text-xl"
        title="GitHub repository and documentation"
      >
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.7153 0.181885C6.08533 0.181885 0.715332 5.55188 0.715332 12.1819C0.715332 17.4919 4.15033 21.9769 8.92033 23.5669C9.52033 23.6719 9.74533 23.3119 9.74533 22.9969C9.74533 22.7119 9.73033 21.7669 9.73033 20.7619C6.71533 21.3169 5.93533 20.0269 5.69533 19.3519C5.56033 19.0069 4.97533 17.9419 4.46533 17.6569C4.04533 17.4319 3.44533 16.8769 4.45033 16.8619C5.39533 16.8469 6.07033 17.7319 6.29533 18.0919C7.37533 19.9069 9.10033 19.3969 9.79033 19.0819C9.89533 18.3019 10.2103 17.7769 10.5553 17.4769C7.88533 17.1769 5.09533 16.1419 5.09533 11.5519C5.09533 10.2469 5.56033 9.16688 6.32533 8.32688C6.20533 8.02688 5.78533 6.79688 6.44533 5.14688C6.44533 5.14688 7.45033 4.83188 9.74533 6.37688C10.7053 6.10688 11.7253 5.97188 12.7453 5.97188C13.7653 5.97188 14.7853 6.10688 15.7453 6.37688C18.0403 4.81688 19.0453 5.14688 19.0453 5.14688C19.7053 6.79688 19.2853 8.02688 19.1653 8.32688C19.9303 9.16688 20.3953 10.2319 20.3953 11.5519C20.3953 16.1569 17.5903 17.1769 14.9203 17.4769C15.3553 17.8519 15.7303 18.5719 15.7303 19.6969C15.7303 21.3019 15.7153 22.5919 15.7153 22.9969C15.7153 23.3119 15.9403 23.6869 16.5403 23.5669C18.9229 22.7633 20.9933 21.2324 22.4599 19.1899C23.9265 17.1475 24.7154 14.6964 24.7153 12.1819C24.7153 5.55188 19.3453 0.181885 12.7153 0.181885Z"
            fill="currentColor"
          />
        </svg>
        <span>GitHub</span>
        <span aria-hidden={true}> ↗</span>
      </Link>
    </header>
  );
}
