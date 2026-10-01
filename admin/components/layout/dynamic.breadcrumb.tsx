"use client";

import { Fragment } from "react";
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
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.segment}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>
                  {crumb.segment}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
