import axios from "axios";
import { Contest, Problem, Solved, User } from "./talbe";

// export const url = "https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/";
export const url = "http://localhost:8080/api/";

export async function severComposeData(api: string, user: User, setProblems: (data: Problem[]) => void, setContests: (data: Contest[]) => void, setSolveds: (data: Solved[]) => void) {
    const response = await axios.post<{ problems: Problem[], contests: Contest[] }>(url + api, null, { timeout: 10000 });
    const data = response.data;
    if (user.contest == -1) {
        setProblems(data.problems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setContests(data.contests.sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()));
    } else {
        setProblems(data.problems.filter((problem) => { return problem.contestId == user.contest; }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setContests(data.contests.filter((contest) => { return contest.id == user.contest; }).sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()));
    }

    if (user.id != -1) {
        const response = await axios.post<Solved[]>(url + `users/solved/${user.userId}`, { timeout: 10000 });
        setSolveds(response.data);
    }
}

export async function severArray<T>(api: string, setDatas: (data: T[]) => void) {
    const response = await axios.post<T[]>(url + api, null, { timeout: 10000 });
    setDatas(response.data);
}