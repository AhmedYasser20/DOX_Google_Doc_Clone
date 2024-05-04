import { DocumentTextIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { getRequestWithToken, postRequest } from "../Requests";
import Navbar from "../Components/Navbar";
import RenameModal from "../Components/RenameModal";
import File from "../Components/File";


const Home = () => {
    const baseUrl = "http://localhost:8080";
    const [sortValue, setSortValue] = useState("All");
    const [sortDropDownOpen, setSortDropDownOpen] = useState(false);
    const [isNewDocAdded, setIsNewDocAdded] = useState(false);
    const prevSelectedSort = useRef(sortValue);
    const [page, setPage] = useState(1);
    const [Documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isOpenedShareMenu, setIsOpenedShareMenu] = useState(null);
    const [optionsDropDownOpen, setOptionsDropDownOpen] = useState(null);

    const navigate = useNavigate();
    const sortMenuRef = useRef();
    const renameMenuRef = useRef();



    useEffect(() => {
        let closeDropdown = (e) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
                setSortDropDownOpen(false);
            }

            if (renameMenuRef.current && !renameMenuRef.current.contains(e.target)) {
                setIsNewDocAdded(false);
            }

        };
        document.addEventListener('click', closeDropdown);

        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, []);


    useEffect(() => {
        let isSortChanged = (prevSelectedSort.current !== sortValue);
        console.log(isSortChanged);
        let pageNum = isSortChanged ? 1 : page;
        const getOwnedFiles = async () => {
            setLoading(true);
            try {
                const response = await getRequestWithToken(`${baseUrl}/document/owned/${pageNum}`);
                console.log(response);
                if (response.status == 200 || response.status == 201) {
                    if (isSortChanged) {
                        setDocuments(response.data);
                    } else {
                        setDocuments(prevDocuments => [...prevDocuments, ...response.data]);
                    }
                    if (response.data.length === 0) {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);
            }
        }
        const getSharedFiles = async () => {
            setLoading(true);
            try {
                const response = await getRequestWithToken(`${baseUrl}/document/shared/${pageNum}`);
                if (response.status == 200 || response.status == 201) {
                    if (isSortChanged) {
                        setDocuments(response.data);
                    } else {
                        setDocuments(prevDocuments => [...prevDocuments, ...response.data]);
                    }
                    if (response.data.length === 0) {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);
            }
        }

        if (sortValue === "Owned") {
            getOwnedFiles();
        }
        else if (sortValue === "Shared") {
            getSharedFiles();
        }
        prevSelectedSort.current = sortValue;
    }, [page, sortValue]);
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }


    return (
        <>
            <Navbar />
            <div className="w-full h-full min-w-[342px] flex mt-[52px]  flex-col">
                <div className="w-full px-4 bg-[#F1F3F4] h-[272px]">
                    <div className="h-full min-h-[252px] mt-4 w-full msm:w-[470px] md:w-[660px] lg:w-[860px] xl:w-[1050px] mx-auto">
                        <div className="flex flex-col w-full h-full font-light text-[14px]">
                            <h1 className="text-black h-fit ml-1.5 w-fit">Start a new document</h1>
                            <div onClick={(e) => { e.stopPropagation(); setIsNewDocAdded(true) }} className="bg-white h-[156px] w-[126px] border-[1px] hover:border-blue-300 cursor-pointer border-gray-200 mt-3.5">
                                <img className="w-full h-full" src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" alt=""></img>
                            </div>
                            <h1 className="text-black h-fit text-[12px] font-medium mt-2 ml-4 w-fit">Blank Document</h1>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full flex justify-center bg-white sm:px-2 flex-col items-center">
                    <div className="flex  h-13 mt-2 flex-row items-center w-full msm:w-[494px] md:w-[685px] space-y-3 lg:w-[885px] xl:w-[1075px] -ml-7">
                        <div className="flex-row flex min-w-[160px] w-6/12">
                            <h1 className="text-[14px] ml-7 mt-2 sm:ml-6 font-medium">Documents</h1>
                        </div>

                        <div className='flex flex-row  w-4/12 items-center relative'>
                            <div ref={sortMenuRef} onClick={(e) => { e.stopPropagation(); setSortDropDownOpen(prev => !prev) }} id="create_post_vote_dropdown_button" className={`text-black ${sortValue == "All" ? '-ml-[6px]' : '-ml-[18px]'}  text-[14px] rounded-lg cursor-pointer no-select w-fit  h-8 focus:outline-none text-center no-select pl-1.5 font-medium hover:bg-blue-100 ${sortDropDownOpen ? "bg-blue-100" : ""} items-center flex flex-row" type="button`}>
                                <h1 className="">{sortValue}</h1>
                                <div className="w-fit flex ml-2 mr-2 flex-row">
                                    <svg className="w-2.5 h-2.5  mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="#F05152" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </div>
                                <div id="vote_duration_dropdown_menu" className={`z-10 absolute mt-37 -ml-13  ${sortDropDownOpen ? '' : 'hidden'} bg-gray-200 rounded-lg shadow w-34  `}>
                                    <ul className="text-xs border-[0.5px] rounded-lg border-gray-400" aria-labelledby="dropdownInformationButton">
                                        <li id="vote_1_day" className={`cursor-pointer border-b-[0.5px] border-gray-400`}>
                                            <p onClick={() => setSortValue('All')} className={`block rounded-t-lg px-4 py-2  text-black   ${sortValue == 'All' ? 'bg-blue-500' : 'hover:bg-blue-400'}`}>All</p>
                                        </li>
                                        <li id="vote_2_day" className={`cursor-pointer border-b-[0.5px] border-gray-400`}>
                                            <p onClick={() => setSortValue('Owned')} className={`block px-4 py-2  text-black   ${sortValue == 'Owned' ? 'bg-blue-500' : 'hover:bg-blue-400'}`}>Owned</p>
                                        </li>
                                        <li id="vote_3_day" className={`cursor-pointer rounded-b-lg border-b-[0.5px] border-gray-400`}>
                                            <p onClick={() => setSortValue('Shared')} className={`block px-4 py-2 rounded-b-lg  text-black  ${sortValue == 'Shared' ? 'bg-blue-500' : 'hover:bg-blue-400'}`}>Shared</p>
                                        </li>

                                    </ul>

                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row w-4/12">
                            <h1 className="text-[14px] -ml-1.5 font-medium">Created</h1>
                        </div>
                    </div>
                    <div id="documents_arranged" onScroll={handleScroll} className={`flex  flex-col mt-2 mb-auto overflow-y-auto h-[400px] w-full msm:w-[494px] md:w-[685px] space-y-3 lg:w-[885px] xl:w-[1075px] mx-auto hide-scrollbar`}>
                        {Documents.map((document, index) => (
                            <File 
                            key={index}
                            document={document}
                            isOpenedShareMenu={isOpenedShareMenu}
                            setIsOpenedShareMenu={setIsOpenedShareMenu}
                            optionsDropDownOpen={optionsDropDownOpen}
                            setOptionsDropDownOpen={setOptionsDropDownOpen}
                            id={document.id}
                            name={document.title}
                            content={document.content}
                            owner={sortValue=="Owned"?"Me":`${document.owner}`}
                            createdAt={document.createdAt}
                            />
                        ))}
                    </div>
                </div>

                {isNewDocAdded && (
                    <div className="community-modal flex flex-row items-center justify-center">
                        <div className='overlay'></div>
                        <div ref={renameMenuRef} className='z-20 flex flex-col w-100%  msm:w-132 h-[300px]'>
                            <RenameModal setIsOpenedShareMenu={setIsNewDocAdded} />
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

export default Home;



