/*eslint-disable*/
import React from 'react';
import axios from 'axios';
// import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Container,
    Grid,
    makeStyles,
    Avatar,
    Box,
    Card,
    CardContent,
    Typography,
    colors,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';

import multiDownload from 'multi-download';
// import { Thumbnail } from '@bit/digiaonline.react-foundation.thumbnail';
import { TocTwoTone } from '@material-ui/icons';

import { Config } from "../../Service/config";
import ApiService from '../../Service/ApiService';

const style = {
    image: {
        border: '0px solid #ccc',
        background: '#fefefe',
    },
};

export default class FileOverviewIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            TotalFiles: [],
            flag: '',
            SearchResult: [],
            Search_Index: '',
            Search_Date: '',
            Search_Folder: '',
            Search_Date_Array: [],
            Search_Folder_Array: [],
            Search_S3_Key_Array: [],
            loaderFlag: false,
            Paid_Button_Text: "UnPaid",
            page: 0,
            rowsPerPage: 5,
            newImage: 'https://miljan.s3.eu-central-1.amazonaws.com/big_Unique_admin_ID_16136401179310/Uploader_1613690612817home-image-1.jpg'
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    }
    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: +event.target.value });
        this.setState({ page: 0 });
    }


    componentDidMount() {
        console.log("Token:", localStorage.getItem('token_Bearer'))

        axios({
            method: 'post',
            url: Config.get_user,
            data: '',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem('token_Bearer')
            }
        }).then((response) => {
            //handle success
            console.log(response);
            if (response.data.status == 200) {
                localStorage.setItem("Email", response.data.data);

                console.log("Token exist as correct !");
            } else {
                localStorage.setItem("token_Bearer", "");
                console.log("Token expired");
                document.location.href = "/login";
            }
        }).catch((response) => {
            //handle error
            console.log(response);
        });

        axios({
            method: 'post',
            url: Config.s3_read_files,
            data: '',
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
            //handle success
            console.log(response);
            if (response.data.status == 200) {

                this.setState({ TotalFiles: response.data.data })
                this.setState({ Search_S3_Key_Array: response.data.data })

                console.log("data get success !", this.state.TotalFiles, localStorage.getItem("Kind"), localStorage.getItem("Unique_ID"));
                let { SearchResult } = this.state;
                // if (localStorage.getItem("Kind") == "Uploader") {
                //     SearchResult = [];
                // } else {
                //     SearchResult = response.data.data;
                // }
                // this.setState({ SearchResult: response.data.data });

                let { Search_Date_Array, Search_Folder_Array } = this.state;
                response.data.data.map(item => {
                    if (localStorage.getItem("Kind") == "Uploader") {
                        if (item.Folder.indexOf(localStorage.getItem("Unique_ID")) > -1) {
                            Search_Folder_Array.push(item.Folder);
                            Search_Date_Array.push(new Date(item.Upload_Created * 10 / 10).toLocaleDateString());
                        }
                        if (item.User_Unique_ID == localStorage.getItem("Unique_ID")) {
                            SearchResult.push(item);
                        }
                    } else {
                        Search_Folder_Array.push(item.Folder);
                        SearchResult.push(item);
                        Search_Date_Array.push(new Date(item.Upload_Created * 10 / 10).toLocaleDateString());
                    }

                    // if (item.User_Unique_ID == localStorage.getItem("Unique_ID") && localStorage.getItem("Kind") != "Admin" && localStorage.getItem("Kind") != "Downloader") {
                    //     SearchResult.push(item);
                    // }
                })

                Search_Folder_Array = Array.from(new Set(Search_Folder_Array));
                Search_Date_Array = Array.from(new Set(Search_Date_Array));

                this.setState({ Search_Folder_Array, Search_Date_Array, SearchResult })

            } else {
                console.log("data get failed !")
            }
        }).catch((response) => {
            //handle error
            console.log(response);
        });

    }

    onDeleteFile = (Fils_ID) => {
        var r = confirm("Do you want to remove this file really?");
        if (r == true) {
            let { loaderFlag } = this.state;
            loaderFlag = true;
            this.setState({ loaderFlag })

            axios({
                method: 'delete',
                url: Config.s3_file_delete + '/' + Fils_ID,
                data: '',
                headers: { "Content-type": "application/json; charset=UTF-8" }
            }).then((response) => {
                //handle success
                console.log(response);
                if (response.data.status == 200) {
                    alert("success removed this file.");
                    location.reload();
                } else {
                    alert("don't exist this file with your ID.");
                    location.reload();
                }
            }).catch((response) => {
                //handle error
                console.log(response);
                alert("Your request failed");
                location.reload();
            });
        } else {
            alert("remove action cancelled.")
        }

    }

    onDownloadFile = (item) => {
        console.log("download", item);
        // var bodyFormData = new FormData();
        // bodyFormData.append("Status", "Downloaded");
        const params = { "count": item.DownloadCount + 1 }
        axios({
            method: 'post',
            url: Config.update_File_DownloadCount + '/' + item.Fils_ID,
            data: params,
            headers: {}
        }).then((response) => {
            //handle success
            console.log(response);
            if (response.data.status == 200) {
                alert("success downloaded this file.")
                location.reload();
            } else {
                alert("don't exist this file with your ID.")
            }
        }).catch((response) => {
            //handle error
            console.log(response);
            alert("Your request failed");
            location.reload();
        });
    }

    onDownloadFolder = () => {
        console.log("onDownloadFolder", this.state.Search_S3_Key_Array);

        var r = confirm("Do you want to download all this files in folder really?");
        if (r == true) {
            let files_Array = [];
            this.state.Search_S3_Key_Array.map((item, index) => {
                files_Array.push(item.download_link);
            })
            console.log("files_Array", files_Array);
            multiDownload(files_Array);
        } else {
            alert("download request cancelled.")
        }
    }

    onDelete_Folder = () => {
        if (this.state.Search_Folder == "") {
            alert("please select delete Folder!")
        } else {
            let { loaderFlag } = this.state;
            loaderFlag = true;
            this.setState({ loaderFlag });

            console.log("delete folder:", this.state.Search_Folder);
            var r = confirm("Do you want to remove this folder really?");
            if (r == true) {
                const params = { "folderPath": this.state.Search_Folder }
                axios({
                    method: 'post',
                    url: Config.delete_s3_folder,
                    data: params,
                    headers: {}
                }).then((response) => {
                    //handle success
                    console.log(response);
                    if (response.data.status == 200) {
                        alert("success removed this folder.")
                        location.reload();
                    } else {
                        alert("don't exist this folder with your ID.");
                        location.reload();

                    }
                }).catch((response) => {
                    //handle error
                    console.log(response);
                    alert("Your request failed");
                    location.reload();
                });
            } else {
                alert("Folder remove request cancelled.")
            }
        }
    }

    onChangeSearch_Date = (e) => {
        console.log("Date", e.target.value);
        this.setState({ Search_Date: e.target.value });

        let { SearchResult, Search_Index, Search_Folder, Search_Date, Search_Date_Array, Search_Folder_Array, Search_S3_Key_Array, TotalFiles } = this.state;
        SearchResult = [];
        Search_S3_Key_Array = [];
        // Search_Date_Array = [];
        Search_Folder_Array = [];

        TotalFiles.map((item, index) => {
            var created_Date = new Date(item.Upload_Created * 10 / 10).toLocaleDateString();
            var file_name = item.download_link.split("/");

            if (file_name[4].indexOf(Search_Index) > -1 && item.Folder.indexOf(Search_Folder) > -1 && created_Date.indexOf(e.target.value) > -1) {
                if (localStorage.getItem("Kind") == "Uploader") {
                    if (item.Folder.indexOf(localStorage.getItem("Unique_ID")) > -1) {
                        Search_Folder_Array.push(item.Folder);
                    }
                    if (item.User_Unique_ID == localStorage.getItem("Unique_ID")) {
                        SearchResult.push(item);
                    }
                    Search_S3_Key_Array.push(item);

                } else {
                    Search_Folder_Array.push(item.Folder);
                    SearchResult.push(item);
                    Search_S3_Key_Array.push(item);
                }
            }
        })
        Search_Folder_Array = Array.from(new Set(Search_Folder_Array));
        this.setState({ SearchResult, Search_S3_Key_Array, Search_Folder_Array })

    }

    onChangeSearch_Folder = (e) => {
        console.log("folder", e.target.value);
        this.setState({ Search_Folder: e.target.value });

        let { SearchResult, Search_Index, Search_Folder, Search_Date, Search_Date_Array, Search_Folder_Array, Search_S3_Key_Array, TotalFiles } = this.state;
        SearchResult = [];
        Search_S3_Key_Array = [];
        // Search_Date_Array = [];
        // Search_Folder_Array = [];

        TotalFiles.map((item, index) => {
            var created_Date = new Date(item.Upload_Created * 10 / 10).toLocaleDateString();
            var file_name = item.download_link.split("/");

            if (file_name[4].indexOf(Search_Index) > -1 && item.Folder.indexOf(e.target.value) > -1 && created_Date.indexOf(Search_Date) > -1) {
                if (localStorage.getItem("Kind") == "Uploader") {
                    if (item.User_Unique_ID == localStorage.getItem("Unique_ID")) {
                        SearchResult.push(item);
                    }
                    Search_S3_Key_Array.push(item);
                } else {
                    SearchResult.push(item);
                    Search_S3_Key_Array.push(item);
                }
            }
        })
        this.setState({ SearchResult, Search_S3_Key_Array })
    }

    onChangeSearchIndex = (e) => {
        console.log("search_Index", e.target.value);
        this.setState({ Search_Index: e.target.value });

        let { SearchResult, Search_Index, Search_Folder, Search_Date, Search_Date_Array, Search_Folder_Array, Search_S3_Key_Array, TotalFiles } = this.state;
        SearchResult = [];
        Search_S3_Key_Array = [];
        // Search_Date_Array = [];
        // Search_Folder_Array = [];

        TotalFiles.map((item, index) => {
            var created_Date = new Date(item.Upload_Created * 10 / 10).toLocaleDateString();
            var file_name = item.download_link.split("/");

            if (file_name[4].indexOf(e.target.value) > -1 && item.Folder.indexOf(Search_Folder) > -1 && created_Date.indexOf(Search_Date) > -1) {
                if (localStorage.getItem("Kind") == "Uploader") {
                    if (item.User_Unique_ID == localStorage.getItem("Unique_ID")) {
                        SearchResult.push(item);
                    }
                    Search_S3_Key_Array.push(item);
                } else {
                    SearchResult.push(item);
                    Search_S3_Key_Array.push(item);
                }
            }
        })
        this.setState({ SearchResult, Search_S3_Key_Array })
    }


    onChangeSearchFilter = (e) => {
        console.log("search_Data:", this.state.Search_Index, this.state.Search_Folder, this.state.Search_Date, this.state.Search_Folder_Array, this.state.Search_Date_Array);
        let { SearchResult, Search_Index, Search_Folder, Search_Date, Search_Date_Array, Search_Folder_Array, Search_S3_Key_Array } = this.state;
        SearchResult = [];
        Search_S3_Key_Array = [];
        this.state.TotalFiles.map((item, index) => {
            var created_Date = new Date(item.Upload_Created * 10 / 10).toLocaleDateString();
            var file_name = item.download_link.split("/");

            if (file_name[4].indexOf(Search_Index) > -1 && item.Folder.indexOf(Search_Folder) > -1 && created_Date.indexOf(Search_Date) > -1) {
                SearchResult.push(item);
                Search_S3_Key_Array.push(item);
            }
        })
        this.setState({ SearchResult, Search_S3_Key_Array })
    }


    render() {
        return (
            <Card className="Top-card-header" key="upload_container_home_card">
                <CardContent>
                    <Box minWidth={1050}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ textAlign: 'center' }}> ID </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}> Preview Image / File Name</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Created Date</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Tag</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}> QR Code </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ textAlign: 'center' }}> ID </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}> Preview Image / File Name</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Created Date</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Tag</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}> QR Code </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>Action</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </CardContent>
            </Card>
        )
    }
}