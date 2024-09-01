export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-white dark:bg-black">
      <div className="flex flex-col space-y-8 pt-8 pb-16 justify-start h-full">
        <h2 className="flex justify-center items-start text-sm md:text-md lg:text-lg xl:text-lg font-light">
          {"Terms and Conditions"}
        </h2>
        <p className="flex justify-center items-start text-sm md:text-md lg:text-lg xl:text-lg font-light">
          {"This is a sample terms and conditions page."}
        </p>
        <p>
          Vectors and icons by{" "}
          <a href="https://www.figma.com/@karthik_shyam?ref=svgrepo.com" target="_blank">
            Karthik Shyam
          </a>{" "}
          in CC Attribution License via{" "}
          <a href="https://www.svgrepo.com/" target="_blank">
            SVG Repo
          </a>
        </p>
      </div>
    </div>
  );
}
