// components/ProjectCard.tsx
import Image from 'next/image';
import { Project } from '@/types/Project';
import { FC } from 'react';
import Link from 'next/link';

interface Props {
  project: Project;
}

const ProjectCard: FC<Props> = ({ project }) => {
  return (
    <Link
      href={project.link}
      target={project.link === "#" ? undefined : "_blank"}
      key={project.id}
      className="flex-shrink-0 w-80">
      <div
        className="bg-white rounded-lg overflow-hidden shadow-md transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl snap-start"
      >
        <div className="relative h-48 w-full">
          <Image
            src={project.imgUrl}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p className="text-gray-600 text-sm">{project.year}</p>
          <p className="text-gray-500 text-base mt-2 line-clamp-3">
            {project.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;