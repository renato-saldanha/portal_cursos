import Image from "next/image";

export const MarketingBackground = () => {
    return (
       <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden rounded-lg  ">
        <div className="w-full h-screen relative ">
          <Image
            src="/login_background.png"
            alt="Marketplace Cover"
            fill
            sizes="(max-width: 1024px) 0vw"
            className="object-cover"
            priority
          />
        </div>

      </div>
    );
}