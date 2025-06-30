import Image from 'next/image';
import { Edit, Trash2 } from 'lucide-react';

interface UserAvatarAndNameProps {
  userPic?: string;
  userName: string;
  date?: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function UserAvatarAndName({ 
  userPic, 
  userName, 
  date, 
  isOwner = false, 
  onEdit, 
  onDelete 
}: UserAvatarAndNameProps) {
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
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-lg lg:text-xl text-primary leading-tight">
            {userName}
          </p>
          {isOwner && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-1 text-primary hover:bg-primary/10 rounded-full transition-colors"
                title="Edit review"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {date && (
          <p className="text-xs lg:text-lg text-text-muted">
            {date}
          </p>
        )}
      </div>
    </div>
  );
} 