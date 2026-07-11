import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/Images/Renofield.png"
      alt="logo"
      height={140}
      width={120}
      className="w-[120px] h-auto object-contain"
    />
  );
};

export default Logo;