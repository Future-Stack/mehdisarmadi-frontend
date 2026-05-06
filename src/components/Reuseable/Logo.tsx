import Image from "next/image";

const Logo = () => {
  return (
    <div >
      <Image
        src="/Images/Renofield.png"
        alt="logo"
        height={140}
        width={120}
        style={{ width: "100%", height: "auto" }}
        className="object-contain"
      />
    </div>
  );
};

export default Logo;