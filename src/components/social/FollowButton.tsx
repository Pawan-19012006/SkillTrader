import { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../ui/GlowButton';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FollowButtonProps {
    targetUserId: string;
    targetUserName?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const FollowButton = ({ targetUserId, className, size = 'sm' }: FollowButtonProps) => {
    const { user, following } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user || user.uid === targetUserId) return null;

    const isFollowing = following.includes(targetUserId);

    const handleFollow = async () => {
        setIsSubmitting(true);
        try {
            const currentUserRef = doc(db, 'users', user.uid);
            const targetUserRef = doc(db, 'users', targetUserId);

            if (isFollowing) {
                // Unfollow
                await updateDoc(currentUserRef, {
                    following: arrayRemove(targetUserId)
                });
                await updateDoc(targetUserRef, {
                    followers: arrayRemove(user.uid)
                });
            } else {
                // Follow
                await updateDoc(currentUserRef, {
                    following: arrayUnion(targetUserId)
                });
                await updateDoc(targetUserRef, {
                    followers: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error("Connection error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GlowButton
            onClick={handleFollow}
            disabled={isSubmitting}
            variant={isFollowing ? 'glass' : 'purple'}
            size={size}
            className={cn(
                "gap-2 uppercase text-[10px] font-bold tracking-widest transition-all",
                isFollowing ? "border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/20" : "shadow-[0_0_15px_rgba(79,70,229,0.2)]",
                className
            )}
        >
            {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserMinus size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Following</span>
                </>
            ) : (
                <>
                    <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Follow</span>
                </>
            )}
        </GlowButton>
    );
};

export default FollowButton;
