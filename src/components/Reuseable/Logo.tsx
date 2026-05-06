import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/Images/Renofield.png"
      alt="logo"
      height={140}
      width={120}
      style={{ width: "120px", height: "auto" }}
      className="object-contain"
    />
  );
};

export default Logo;