import os
from dataclasses import dataclass
from typing import Sequence
from .workspace import get_dependency_chain


@dataclass
class Project:
    workspace: str
    build_command: str
    deploy_command: Sequence[str]
    build_output: str
    relevant_paths: Sequence[str]


def _create_project(
    workspace: str,
    build_command: str,
    deploy_command: Sequence[str],
    build_output: str,
    additional_dependency_paths: Sequence[str],
) -> Project:
    relevant_paths: Sequence[str] = [
        *[f"{dependency}/**" for dependency in get_dependency_chain(workspace)],
        *additional_dependency_paths,
    ]
    return Project(
        workspace=workspace,
        build_command=build_command,
        deploy_command=deploy_command,
        build_output=build_output,
        relevant_paths=relevant_paths,
    )


def create_yarn_workspace_project(
    workspace: str, pre_deploy_command: Sequence[str] = []
) -> Project:
    deploy_command = [
        *pre_deploy_command,
        "./node_modules/.bin/firebase deploy"
        + f" --token={os.environ.get('FIREBASE_TOKEN')}"
        + f" --non-interactive --only hosting:{workspace}",
    ]
    return _create_project(
        workspace=workspace,
        build_command=f"yarn workspace {workspace} build",
        deploy_command=deploy_command,
        build_output=f"{workspace}/build",
        additional_dependency_paths=["package.json", "yarn.lock", "configuration/**"],
    )


def get_projects() -> Sequence[Project]:
    return [
        create_yarn_workspace_project(workspace="blog"),
        create_yarn_workspace_project(
            workspace="main-site-frontend",
            pre_deploy_command=["yarn workspace main-site-frontend ci-postbuild"],
        ),
        create_yarn_workspace_project(workspace="samlang-demo-frontend"),
        create_yarn_workspace_project(workspace="samlang-docs"),
        create_yarn_workspace_project(workspace="ten-web-frontend"),
    ]