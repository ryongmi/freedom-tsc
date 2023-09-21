import AllUserManagementTable from "@/components/AllUserManagementTable";
import PracticeTable from "../../components/PracticeTable";
import AlertUserManagementTable from "@/components/AlertUserManagementTable";
import BanedUserManagementTable from "@/components/BanedUserManagementTable";
import AlertUserReasonCheck from "@/components/AlertUserReasonCheck";
import BanedUserReasonCheck from "@/components/BanedUserReasonCheck";
import CommedCodeManagement from "@/components/CommedCodeManagement";
import CommonCodeManagemaneDetail from "@/components/CommonCodeManagemaneDetail";
import { Suspense } from "react";

export default function Pgae() {
  return (
    <div>
      <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>loading... on initial request</p>
        }
      >
        <h2>유저 {">"} 전체 유저관리</h2>
        <AllUserManagementTable />
      </Suspense>
      <h2>공통 코드 관리 상세</h2>
      <CommonCodeManagemaneDetail />
      <h2>공통코드 {">"} 공통코드 관리</h2>
      <CommedCodeManagement />
      <h2>벤 유저 사유확인 페이지</h2>
      <BanedUserReasonCheck />
      <h2>경고 유저 사유확인 페이지</h2>
      <AlertUserReasonCheck />
      <h2>유저 {">"} 경고 유저관리</h2>
      <AlertUserManagementTable />
      <h2>유저 {">"} 벤 유저관리</h2>
      <BanedUserManagementTable />
      <h2>연습용 테이블</h2>
      <PracticeTable />
    </div>
  );
}
