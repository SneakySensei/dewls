export default function Footer() {
    return (
        <footer className="px-4 pb-10 pt-20">
            <h1 className="text-display-1 text-neutral-400">
                Games that make <br />
                connections{" "}
                <svg
                    width="49"
                    height="28"
                    viewBox="0 0 49 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-auto w-12"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M44.8144 4.05721C37.4887 20.9893 20.6579 29.0545 3.72715 21.3179C3.16352 21.0602 2.49777 21.3081 2.23957 21.8651C1.98219 22.4316 2.23013 23.0983 2.79376 23.3559C20.942 31.6574 39.0209 23.094 46.8739 4.95151C47.1199 4.386 46.8578 3.72044 46.2892 3.47277C45.7215 3.2346 45.0604 3.4917 44.8144 4.05721Z"
                        fill="#2D2D3A"
                    />
                    <path
                        d="M16.7284 13.2152C18.5268 13.0618 19.8605 11.4795 19.7071 9.68104C19.5537 7.88257 17.9714 6.54899 16.1729 6.70238C14.3744 6.85576 13.0408 8.43803 13.1942 10.2365C13.3476 12.035 14.9299 13.3686 16.7284 13.2152Z"
                        fill="#2D2D3A"
                    />
                    <path
                        d="M29.9141 8.60137C31.6774 8.45098 32.985 6.89963 32.8346 5.13631C32.6842 3.37299 31.1328 2.06547 29.3695 2.21586C27.6062 2.36625 26.2987 3.91759 26.4491 5.68091C26.5994 7.44423 28.1508 8.75175 29.9141 8.60137Z"
                        fill="#2D2D3A"
                    />
                </svg>
            </h1>
            <div className="mt-[120px] text-center text-body-3 font-medium text-neutral-400">
                Cooked with 🔥 by Bawarchis
            </div>
        </footer>
    );
}
