import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";

import {
  Grid,
  makeStyles,
  Avatar,
  Box,
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

import PageTitle from "../components/common/PageTitle";

import { Config } from "../Service/config";
import ApiService from '../Service/ApiService';
import axios from 'axios';

const FileOverview = () => {

  const [TotalFiles, setTotalFiles] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    console.log("effedt");

    axios({
      method: 'post',
      url: Config.s3_read_files,
      data: '',
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((response) => {
      //handle success
      console.log("response: ", response);
      if (response.data.status == 200) {
        setTotalFiles(response.data.data)
      } else {
        console.log("data get failed !")
      }
    }).catch((response) => {
      //handle error
      console.log(response);
    });

  },[setTotalFiles])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(+event.target.value);
  }


  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Add New Post" subtitle="Blog Posts" className="text-sm-left" />
      </Row>

      {/* Default Dark Table */}
      <Row>
        <Col>
          <Card small className="mb-4 overflow-hidden">
            <CardHeader className="bg-dark">
              <h6 className="m-0 text-white">Active Users</h6>
            </CardHeader>
            <CardBody className="bg-dark p-0 pb-3">
              <table className="table table-dark mb-0">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" className="border-0">
                      #
                  </th>
                    <th scope="col" className="border-0">
                      First Name
                  </th>
                    <th scope="col" className="border-0">
                      Last Name
                  </th>
                    <th scope="col" className="border-0">
                      Country
                  </th>
                    <th scope="col" className="border-0">
                      City
                  </th>
                    <th scope="col" className="border-0">
                      Phone
                  </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Ali</td>
                    <td>Kerry</td>
                    <td>Russian Federation</td>
                    <td>Gdańsk</td>
                    <td>107-0339</td>
                  </tr>
                </tbody>
              </table>
              {/* <TablePagination
                component="div"
                count={100}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              /> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
export default FileOverview;
