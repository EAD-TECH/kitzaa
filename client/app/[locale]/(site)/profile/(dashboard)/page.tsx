import PersonalInfoCard from "@/features/profile/components/PersonalInfoCard";
import OrganizerApplicationCard from "@/features/organizer-application/components/OrganizerApplicationCard";

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PersonalInfoCard />
      <OrganizerApplicationCard />
    </div>
  );
};

export default ProfilePage;
