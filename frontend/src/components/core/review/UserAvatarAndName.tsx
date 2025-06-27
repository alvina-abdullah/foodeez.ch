import Image from 'next/image';

interface UserAvatarAndNameProps {
  userPic?: string;
  userName: string;
  date?: string;
}

export default function UserAvatarAndName({ userPic, userName, date }: UserAvatarAndNameProps) {
  return (
    <div className="flex items-center gap-4 mb-3">
      {userPic ? (
        <Image
          src={userPic}
          alt={userName}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow"
        />
      ) : (
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary">
          <span className="text-primary text-lg font-bold">
            {userName.charAt(0)}
          </span>
        </div>
      )}
      <div>
        <p className="font-semibold text-lg lg:text-xl text-primary leading-tight">
          {userName}
        </p>
        <p className="text-xs lg:text-lg text-text-muted">
          {date}
        </p>
      </div>
    </div>
  );
} 