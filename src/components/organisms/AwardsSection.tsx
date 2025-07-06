import React from 'react';
import SectionTitle from '@/components/atoms/SectionTitle';
import AwardItem from '@/components/atoms/AwardItem';

export default function AwardsSection() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-800">
      <SectionTitle title="Awards" />

      <div className="space-y-6">
        <AwardItem
          title="Leonardo Innovation Award"
          organization="Leonardo UK Ltd"
          year="2025"
          description="Nominated for company innovation award for releasing software at rapid turnaround whilst maintaining the high quality standards."
        />

        <AwardItem
          title="Edinburgh Award (Work Experience)"
          organization="University of Edinburgh"
          year="2023"
          description="Awarded for completing significant work experience whilst studying as an undergraduate. Awarded for becoming the first undergraduate to be employed as an Engineer at Leonardo UK in Edinburgh whilst studying."
        />

        <AwardItem
          title="Edinburgh Award (Employ.Ed on Campus)"
          organization="University of Edinburgh"
          year="2022"
          description="Awarded for completing an internship with the School of Informatics where I was responsible for delivering the offer holder communication plan for the Class of 2022."
        />
      </div>
    </div>
  );
}
