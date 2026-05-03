import Image from "next/image";

const Logo = () => {
  return (
    <div >
      <Image
        src="/Images/Renofield.png"
        alt="logo"
        height={200}
        width={200}
        className="object-contain"
      />
    </div>
  );
};

export default Logo;