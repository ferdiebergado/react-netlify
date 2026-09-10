import { UserIcon } from '@phosphor-icons/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserAvatarProps {
  name?: string;
  picture?: string;
}

export function UserAvatar({ picture, name = 'User avatar' }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={picture} alt={name} />
      <AvatarFallback>
        <UserIcon />
      </AvatarFallback>
    </Avatar>
  );
}
