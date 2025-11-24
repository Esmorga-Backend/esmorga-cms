interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader = ({ size = 20, color = "#fff" }: LoaderProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      aria-hidden="true"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="3">
          <circle strokeOpacity=".3" cx="18" cy="18" r="16" />
          <path d="M34 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
};

export default Loader;
