"use client";

import { useOrganizerApplications } from "../../hooks/useOrganizerApplications";

export default function OrganizerApplicationCard() {
  const { data, isLoading, isError } = useOrganizerApplications();

  if (isLoading) return <p>Yükleniyor...</p>;
  if (isError) return <p>Başvurular alınamadı.</p>;

  return (
    <div>
      <p>{data?.applications.length ?? 0} başvuru bulundu.</p>

      {data?.applications.map((item) => (
        <div key={item._id}>
          <p>{item.institutionData.name}</p>
          <p>{item.status}</p>
        </div>
      ))}
    </div>
  );
}