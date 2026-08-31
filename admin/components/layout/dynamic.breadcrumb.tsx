"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function DynamicBreadCrumb() {
  const pathname = usePathname();
  const splitResult = pathname.split("/");
  const segments = splitResult.filter(Boolean);
  if (segments.length === 0) {
    segments.push("Dashboard");
  }

  const crumbs = segments.map((segment, index) => {
    const partsUntilHere = segments.slice(0, index + 1);
    console.log(partsUntilHere);
    const path = partsUntilHere.join("/");
    const href = `/${path}`;

    return {
      segment,
      href,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb) => (
          <>
            <BreadcrumbItem key={crumb.href}>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.segment}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.segment}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
