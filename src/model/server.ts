import axios from "axios";
// import { NavigateFunction } from "react-router-dom";
import { Contest, Problem } from "./talbe";

// export const url = "https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/";
export const url = "http://localhost:8080/api/";

export async function severComposeData(api: string, id: number, setProblems: (data: Problem[]) => void, setFinishProblems: (data: Problem[]) => void, setContests: (data: Contest[]) => void, setFinishContests: (data: Contest[]) => void) {
    const response = await axios.post<{ problems: Problem[], contests: Contest[] }>(url + api, null, { timeout: 10000 });
    const data = response.data;
    setProblems(data.problems);
    setContests(data.contests);
    if (id == -1) {
        setFinishProblems(data.problems.filter((problem) => { 
            const contest = data.contests.find((contest) => contest.id === problem.contestId);
            if (contest) return new Date(contest.eventTime) < new Date();
            else return false;
        }));
        setFinishContests(data.contests.filter((contest) => { return new Date(contest.eventTime) < new Date(); }));
    } else {
        setFinishProblems(data.problems.filter((problem) => { return problem.contestId == id; }));
        setFinishContests(data.contests.filter((contest) => { return contest.id == id; }));
    }
}

export async function severArray<T>(api: string, setDatas: (data: T[]) => void) {
    const response = await axios.post<T[]>(url + api, null, { timeout: 10000 });
    setDatas(response.data);
}